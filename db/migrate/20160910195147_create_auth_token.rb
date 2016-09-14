class CreateAuthToken < ActiveRecord::Migration[5.0]
  def change
    create_table :auth_tokens do |t|
      t.string :token
      t.string :status
      t.integer :user_id

      t.timestamps
    end
  end
end
