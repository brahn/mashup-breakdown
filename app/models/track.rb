class Track < ActiveRecord::Base

  has_many :samples

  def file_url
    return "/tracks/#{self.filename}"
  end

end
