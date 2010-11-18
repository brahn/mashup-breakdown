class CreateTracks < ActiveRecord::Migration

  def self.up
    create_table :tracks do |t|
      t.string :title, :youtube_id
      t.float :duration

      t.timestamps
    end
  end

  def self.down
    drop_table :tracks
  end
end
