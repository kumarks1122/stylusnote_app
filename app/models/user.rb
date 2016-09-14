class User < ActiveRecord::Base
	has_many :items
	has_many :messages
	has_many :auth_tokens
	has_many :notes
	belongs_to :team, optional: true
	has_one :created_team, :foreign_key => 'creator_id', :class_name => :Team
end