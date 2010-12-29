class StashSampleData < ActiveRecord::Migration
  def self.up
    create_table :samplestashes do |t|
      t.string :album_short_name
      t.integer :track_num
      t.text :sample_data
      t.timestamps
    end
  end

  def self.down
    drop_table :samplestashes
  end
end
