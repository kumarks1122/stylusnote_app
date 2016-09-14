class CreateNotes < ActiveRecord::Migration[5.0]
  def change
    create_table :notes do |t|
    	t.string :text
      t.integer :user_id
      t.string :status,:default=>'active'
      t.timestamps
    end
  end
end
