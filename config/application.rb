require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Peafowl
  class Application < Rails::Application
  	config.assets.enabled = true
  	config.active_job.queue_adapter = :delayed_job
    
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.assets.paths << "#{Rails.root}/app/assets/templates"
    config.assets.paths << "#{Rails.root}/app/assets/fonts"

    config.time_zone = 'Asia/Kolkata'
  end
end
