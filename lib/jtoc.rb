module JTOpenCourse

  VERSION = "0.0.4-alpha"

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

    def create_directories
      mkdir_p(SCAFFOLD_DIRECTORIES)
    end

    def mkdir_p(directories)
      Array(directories).each do |d|
        FileUtils.mkdir_p(path.join(d))
      end
    end

  end

end
