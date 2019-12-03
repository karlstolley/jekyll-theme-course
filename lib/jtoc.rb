module JTOpenCourse

  VERSION = "0.0.4-alpha"

  SPELLED_NUMS = %w(
    Zero One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen
    Sixteen Seventeen Eighteen Nineteen Twenty Twenty-One Twenty-Two Twenty-Three Twenty-Four
    Twenty-Five
  )

  # No small amount of this code has been either inspired or just about lifted from Jekyll's
  # ThemeBuilder class at https://github.com/jekyll/jekyll/blob/master/lib/jekyll/theme_builder.rb

  class SiteBuilder
    SCAFFOLD_DIRECTORIES = %w(
      _data policies projects syllabus/_policies syllabus/_projects syllabus/_weeks
    ).freeze

    attr_reader :name, :path

    def initialize(course_name)
      @name = course_name.chomp
      @path = Pathname.new(File.expand_path(name, Dir.pwd))
    end

    def create!
      create_directories
    end

    def starter_path
      @starter_path ||= Pathname.new(File.expand_path("starter_files", __dir__))
    end

    def create_directories
      mkdir_p(SCAFFOLD_DIRECTORIES)
    end

    def create_template_data

    def mkdir_p(directories)
      Array(directories).each do |d|
        FileUtils.mkdir_p(path.join(d))
      end
    end

    def render_erb(contents)
      ERB.new(contents).result binding
    end

    def process_template(filename)
      render_erb(template_file(filename).read)
    end

    def find_template_file(filename)
      [
        starter_path.join("#{filename}.erb"),
        starter_path.join(filename.to_s)
      ].find(&:exist?)
    end

    def write_file(filename, contents)
      full_path = path.join(filename)
      File.write(full_path, contents)
    end

  end

end
