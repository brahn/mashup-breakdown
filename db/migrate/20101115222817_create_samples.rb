class CreateSamples < ActiveRecord::Migration

  require 'FasterCSV'

  class Sample < ActiveRecord::Base
    def self.import_from_csv data_filename=nil
      if !data_filename
        data_filename = "#{RAILS_ROOT}/db/initial_data_samples.csv"
      end
      FasterCSV.foreach(data_filename) do |row|
        self.create(:track_id => row[0],
                    :start => row[1].mmss_to_sec,
                    :stop => row[1].mmss_to_sec + 10,
                    :title => row[2],
                    :artist => row[3])
      end
    end
  end

  def self.up
    create_table :samples do |t|
      t.string :title, :artist
      t.float :start, :stop
      t.integer :track_id

      t.timestamps
    end
    Sample.import_from_csv
  end

  def self.down
    drop_table :samples
  end
end
