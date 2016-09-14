class UsersController < ApplicationController

	def login
		user_resp = UserManager.new(params[:user].permit!).login
		render :json=> user_resp[:data],:status=>user_resp[:response_code]
	end

	def is_valid
		user_resp = UserManager.new({},get_token).check_token
		render :json=> user_resp[:data],:status=>user_resp[:response_code]
	end

	def update
		user_resp = UserManager.new(params[:user].permit!,get_token).update(current_user)
		render :json=> user_resp[:data],:status=>user_resp[:response_code]
	end

	def signup
		user_resp = UserManager.new(params[:user].permit!).signup
		render :json=> user_resp[:data],:status=>user_resp[:response_code]
	end

	def team
		team_resp = UserManager.new({},get_token).manage_team(params[:team].permit!,current_user)
		render :json=> team_resp[:data],:status=>team_resp[:response_code]
	end

	def team_todos
		@users = current_user.team.users		
		response_json = []
		@users.each do |usr|
			user_data = {
				:id=> usr.id,
				:name=> usr.name,
				:email=> usr.email,
				:image_url=> usr.image_url,
				:username=> usr.username,
				:todos => []
			}
			usr_todos = usr.items.where("item_type=? and status!='deleted' and status!='archived' and ((updated_at <= ? and status='new') or (updated_at >= ? and updated_at <= ?))", 'team', Time.now.end_of_day, Time.now.beginning_of_day, Time.now.end_of_day)
			user_data[:todos] = usr_todos
			response_json << user_data
		end
		render :json=> response_json
	end

	def remove_member
		team_resp = UserManager.new({},get_token).remove_member(params[:user_id],current_user)
		render :json=> team_resp[:data],:status=>team_resp[:response_code]
	end

	def add_member
		team_resp = UserManager.new({},get_token).add_member(params[:email],current_user)
		render :json=> team_resp[:data],:status=>team_resp[:response_code]
	end
end
