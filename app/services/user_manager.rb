class UserManager
	attr_accessor :token, :user_params
	def initialize(params={},token="")
		@token = token
		@user_params = params
	end

	def login
		user = User.find_by({:email=>@user_params[:email]})
		password_md5 = Digest::MD5.hexdigest(@user_params[:password])
		new_token = ""
		new_token_date = Time.now.strftime('%s')
		new_token = Digest::MD5.hexdigest("#{new_token_date}#{@user_params[:email]}")
		if user.present? && user.password==password_md5
			auth_tokens = user.auth_tokens
			auth_tokens.update_all({:status=>'inactive'})
			if auth_tokens.length>=5
				auth_token = user.auth_tokens.order(:updated_at).first
				auth_token.update_attributes({:token=>new_token, :status=>'active'})
			else
				user.auth_tokens.create({:token=>new_token, :status=>'active'})
			end
			return {:response_code=> 200, :data=>{:token=> new_token}}
		else
			return {:response_code=> 400, :data=>{:message=> "Invalid email/password."}}
		end
	end

	def check_token
		auth_token = AuthToken.find_by({:token=>@token})
		if auth_token.present?
			auth_token.update_attributes({:status=>'active'})
			token_user = auth_token.user
			team = token_user.team.present? ? token_user.team : {}
			return {:response_code=> 200, :data=>{:token=> auth_token.token, :user=>token_user, :valid=> true, :team=> team}, :message=> "valid"}
		else
			return {:response_code=> 400, :data=>{:valid=> false}, :message=> "invalid"}
		end
	end

	def signup
		user = User.find_by({:email=>@user_params[:email]})
		if user.nil?
			password_md5 = Digest::MD5.hexdigest(@user_params[:password])
			new_token = ""
			new_token_date = Time.now.strftime('%Y%m%d')
			new_token = Digest::MD5.hexdigest("#{new_token_date}#{@user_params[:email]}")
			user = User.create({:name=>@user_params[:name], :email=> @user_params[:email], :password=>password_md5})
			user.auth_tokens.create({:token=>new_token, :status=>'active'})
			return {:response_code=> 200, :data=>{:token=> new_token, :user=> user} }
		else
			return {:response_code=> 400, :data=>{:message=> "Email already taken."}}
		end
	end

	def current_user
		auth_token = AuthToken.find_by({:token=>@token})
		if auth_token.present?
			auth_token.update_attributes({:status=>'active'})
			token_user = auth_token.user
			return token_user
		else
			return nil
		end
	end

	def update(current_user)
		if(current_user.present? && current_user.email==@user_params[:email])
			current_user.name = @user_params[:name]
			current_user.image_url = @user_params[:image_url]
			current_user.username = @user_params[:username]
			current_user.save
			return {:response_code=> 200, :data=>{ :message=> "Updated Successfully", :user=> current_user, :valid=> true }}
		else
			return {:response_code=> 400, :data=>{ :message=> "Invalid Token", :valid=> false }}
		end
	end

	def slack_hook(item, current_user)
		cm_icon_url = "https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAf8AAAAJDZjZjNjNDIxLTgwNmMtNDQ2Ni05YWQ4LWRiMWQyOTY0OTE3Yw.png"
		message_title = item.status == 'completed' ? item.user.name+" has completed a task" : item.status == 'new' ? item.user.name+" has created a task" : ""
		message_format = {
			"username": message_title,
			"attachments": [{
				"color": "#36a64f",
				"fields": [{
						"title": item.text
				}]
			}]
		}
		message_format[:icon_url] = cm_icon_url
		if item.user.image_url.present?
			message_format[:icon_url] = item.user.image_url
		end
		if (message_title!="" && item.item_type=='team' && current_user.team.present? )

			uri = URI.parse(current_user.team.slack_url)
			http = Net::HTTP.new(uri.host, uri.port)
			http.use_ssl = true

			request = Net::HTTP::Post.new(uri.request_uri)
			request.body = message_format.to_json

			response = http.request(request)
		end
	end
	handle_asynchronously :slack_hook

	def manage_team(team_params,current_user)
		if current_user.present?
			team = current_user.team
			if team.present?
				team.update_attributes({:name=>team_params[:name],:email=>team_params[:email],:slack_url=>team_params[:slack_url]})
				return {:response_code=> 200, :data=>{ :message=> "Updated Successfully", :team=> team, :user=> current_user, :valid=> true }}
			else
				team = Team.create({:name=>team_params[:name],:email=>team_params[:email],:slack_url=>team_params[:slack_url],:creator_id=> current_user.id })
				current_user.team_id = team.id
				current_user.save
				return {:response_code=> 200, :data=>{ :message=> "Updated Successfully", :team=> team, :user=> current_user, :valid=> true }}
			end
		else
			return {:response_code=> 400, :data=>{ :message=> "Invalid Token", :valid=> false }}
		end
	end

	def add_member(add_user_email, current_user)
		team = current_user.team
		if team.present?
			adding_user = User.find_by({email: add_user_email})
			if adding_user.present?
				if !adding_user.team_id.present?
					adding_user.team_id = team.id
					adding_user.save
					return {:response_code=> 200, :data=>{ :message=> "Added Successfully", :user=> adding_user, :valid=> true }}
				else
					message = adding_user.team_id==team.id ? "User was already in our team" : "User was already in another team"
					return {:response_code=> 400, :data=>{ :message=> message, :valid=> false }}	
				end
			else
				return {:response_code=> 400, :data=>{ :message=> "Invalid email", :valid=> false }}
			end
		else 
			return {:response_code=> 400, :data=>{ :message=> "Invalid team", :valid=> false }}
		end
	end

	def remove_member(remove_user_id, current_user)
		team = current_user.team
		removing_user = User.find(remove_user_id)
		if removing_user.present? && removing_user.team_id==team.id
			removing_user.team_id = nil
			removing_user.save
			if removing_user.id==team.creator_id
				team.creator_id = nil
				team.creator_id = team.users.first.id if (team.users.first.present? && team.users.first.id.present?)
				team.save
			end
			return {:response_code=> 200, :data=>{ :message=> "Removed Successfully", :valid=> false }}	
		else
			return {:response_code=> 400, :data=>{ :message=> "Invalid User", :valid=> false }}
		end
	end

	def logout
		
	end
end