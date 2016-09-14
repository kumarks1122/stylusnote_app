class AddFieldToItem < ActiveRecord::Migration[5.0]
  def up
  	add_column :items,:item_type,:string
  end
  def down
  	remove_column :items,:item_type
  end
end
