class CreateTracks < ActiveRecord::Migration

  require 'FasterCSV'

  class Track < ActiveRecord::Base
    def self.import_from_csv data_filename=nil
      if !data_filename
        data_filename = "#{RAILS_ROOT}/db/initial_data_tracks.csv"
      end
      FasterCSV.foreach(data_filename) do |row|
        self.create(:title => row[0], :youtube_id => row[1],
                    :duration => row[2].mmss_to_sec)
      end
    end
  end

  def self.up
    create_table :tracks do |t|
      t.string :title, :youtube_id
      t.float :duration

      t.timestamps
    end
    Track.import_from_csv
  end

  def self.down
    drop_table :tracks
  end
end
