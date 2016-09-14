class CreateItem < ActiveRecord::Migration[5.0]
  def change
    create_table :items do |t|
      t.string :text
      t.string :status
      t.integer :user_id

      t.timestamps
    end
  end
end
