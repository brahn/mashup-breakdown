# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  # javascript code to load a ruby value into a javascript variable
  def setup_js_var(js_var_name, value, default = nil)
    value = value || default;
    if value && (value.kind_of? String)
      "var #{js_var_name} = '#{escape_javascript(value)}';"
    elsif value && (value.kind_of? Symbol)
      "var #{js_var_name} = '#{escape_javascript(value.to_s)}';"
    elsif (value)
      "var #{js_var_name} = #{value};"
    else
      "var #{js_var_name} = null;"
    end
  end

end
