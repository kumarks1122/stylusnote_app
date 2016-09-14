class AddFieldsToUsers < ActiveRecord::Migration[5.0]
  def up
    	add_column :users,:image_url,:string
    	add_column :users,:username,:string
    end
    def down
    	remove_column :users,:image_url
    	remove_column :users,:username
    end
end
