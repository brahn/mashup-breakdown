
# takes an array of strings, returns a single string that concatenates
# the strings with commas and 'and' as appropriate
def grammatical_list arr
  if arr.nil? || arr.size == 0
    nil
  elsif arr.size == 1
    arr[0]
  else
    new_arr = []
    new_arr.replace(arr)  # copy arr so original is not damaged
    new_arr[arr.size - 2] = new_arr[arr.size - 2] + " and " +
                            new_arr[arr.size - 1]
    new_arr.delete_at(new_arr.size - 1)
    new_arr.join(", ")
  end
end

class String

  def mmss_to_sec
    Time.parse("0:" + self) - Time.parse("0:0:0")
  end

  def usedots(length)
    if (length <= 0)
      "..."
    elsif self.length <= length
      self
    else
      self[0..(length-1)] + "..."
    end
  end

  def noblank
    if self.blank?
      "&nbsp;&mdash;&nbsp;"
    else
      self
    end
  end

  def inflect_number n, show_number = false
    (show_number ? n.to_s + " " : "") +
    (n == 1 ? self.singularize : self.pluralize)
  end

end

