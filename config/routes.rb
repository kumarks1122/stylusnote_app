Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "home#index"
  get "users/is_valid"
  post "users/login"
  post "users/signup"
  post "users/team"
  get "users/team_todos"
  post "users/add_member"
  post "users/remove_member"
  post "todos/update_notes"

  resources :users
  resources :todos

  get '*path', to: "home#index", format: :html
end
