class AddSetNameToStash < ActiveRecord::Migration
  def self.up
    change_table :samplestashes do |t|
      t.string :sample_set_name
    end
  end

  def self.down
    change_table :samplestashes do |t|
      t.remove :sample_set_name
    end
  end
end
