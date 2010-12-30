class AddSetNameToStash < ActiveRecord::Migration
  def self.up
    change_table :samplestashes do |t|
      t.string :stash_name
    end
  end

  def self.down
    change_table :samplestashes do |t|
      t.remove :stash_name
    end
  end
end
