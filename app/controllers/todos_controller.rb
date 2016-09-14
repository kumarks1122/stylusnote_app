class TodosController < ApplicationController
	before_action :check_user

	def index
		item_type = params[:item_type].present? ? params[:item_type] : "personal"
		date_filter = params[:date].present? ? Time.strptime(params[:date], "%m/%d/%Y") : Time.now
		@todos = current_user.items.where("item_type=? and status!='deleted' and ((updated_at <= ? and status='new') or (updated_at >= ? and updated_at <= ?))", item_type, date_filter.end_of_day, date_filter.beginning_of_day, date_filter.end_of_day)
		@notes = current_user.notes.where("status!='deleted'")
		render :json=> {todos: @todos, notes: @notes}
	end

	def create
		todo = current_user.items.create(todo_params)
		if params[:todo][:current_date].present? && params[:todo][:current_date]!=0
			todo.updated_at = todo.updated_at + 1.day
			todo.save
		end
		user_resp = UserManager.new({},get_token).slack_hook(todo, current_user)
		render :json=> {:data=> todo}
	end
	
	def update
		todos = current_user.items.where({:id=>params[:id]})
		if todos.length > 0
			todos.first.update_attributes(todo_params)
			if params[:todo][:current_date].present? && params[:todo][:current_date]!=0
				todos.first.updated_at = todos.first.updated_at + 1.day
				todos.first.save
			end
			user_resp = UserManager.new({},get_token).slack_hook(todos.first, current_user)
			render :json=> {:data=>todos.first, :message=>'success'}
		else
			render :json=> {:message=>'failed'},:status=>400
		end
	end

	def update_notes
		if note_params[:id].present?
			note = Note.find(note_params[:id])
			if note.present?
				note.update_attributes(note_params) if note.user
				render :json=> note
			else
				render :json=> {:message=>'failed'},:status=>400
			end
		else
			note = current_user.notes.create(note_params)
			render :json=> note
		end
	end

	private
	def check_user
		if current_user.nil?
			redirect_to root_path
		end
	end

	def todo_params
		params.require(:todo).permit(:text,:status,:item_type)
	end

	def note_params
		params.require(:note).permit(:id,:text,:status)
	end
end
