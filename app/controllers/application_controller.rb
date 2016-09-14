class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :get_token, :current_user
  skip_before_action :verify_authenticity_token
  def current_user
  	UserManager.new({},get_token).current_user
  end

  def get_token
		if request.headers['Authorization'].present?
			token = request.headers['Authorization'].split('Token')
			return token.delete_if(&:blank?)[0].strip if token.delete_if(&:blank?).present?
		end
	end
end
