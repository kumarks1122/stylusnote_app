class CreateTeam < ActiveRecord::Migration[5.0]
  def change
    create_table :teams do |t|
      t.string :name
      t.string :email
      t.string :slack_url
      t.string :creator_id

      t.timestamps
    end
  end
end
