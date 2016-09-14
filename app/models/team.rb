class Team < ActiveRecord::Base
	has_many :users
	belongs_to :creator, :foreign_key => :creator_id, :class_name => :User
end