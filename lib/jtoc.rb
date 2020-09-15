module JTOpenCourse

  require 'date'
  require 'erb'
  require 'fileutils'
  require 'pathname'

  VERSION = "2.1.0"

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

    SCAFFOLD_PAGE_STUBS = %w(
      index.md projects/index.md policies/index.md
    ).freeze

    DEFAULT_VALUES = {
      weeks: 16,
      projects: 3,
      days: "Monday, Wednesday",
      url: "http://example.com/",
      number: "COM 101",
      title: "Introduction to Communication",
      instructor: "Horatio Q. Birdbath",
      email: "instructor@example.com",
      cc: false
    }

    attr_reader :counter, :name, :path, :anchor_date, :week_count, :project_count, :days, :url, :number, :title, :instructor, :cc, :email

    def initialize(args, options)
      @counter = 0
      @name = args.first.chomp
      @path = Pathname.new(File.expand_path(@name, Dir.pwd))

      @anchor_date = set_value(find_next_monday(options['monday']),find_next_monday)
      @week_count = set_value(options['weeks'], DEFAULT_VALUES[:weeks]).to_i
      @project_count = set_value(options['projects'], DEFAULT_VALUES[:projects]).to_i
      @days = set_value(options['days'], DEFAULT_VALUES[:days]).split(/\W+/)

      @url = set_value(options['url'],DEFAULT_VALUES[:url]).chomp('/')
      @number = set_value(options['number'],DEFAULT_VALUES[:number])
      @title = set_value(options['title'],DEFAULT_VALUES[:title])
      @instructor = set_value(options['instructor'], set_value(query_git_config('user.name'),DEFAULT_VALUES[:instructor]))
      @cc = set_value(options['cc'], DEFAULT_VALUES[:cc])

      @email = set_value(query_git_config('user.email'),DEFAULT_VALUES[:email])
    end

    def self.path_check(name)
      Pathname.new(File.expand_path(name, Dir.pwd)).exist?
    end

    def set_value(custom,default)
      if custom.to_s.empty?
        custom = default
      end
      custom
    end

    def query_git_config(val)
      begin
        val = `git config --global #{val}`.chomp
        val.empty? ? false : val
      rescue
        false
      end
    end

    def find_next_monday(date=Date.today.to_s)
      date = Date.parse(date)
      while date.cwday > 1
        date += 1
      end
      date
    end

    def create!
      create_directories
      create_gitignore
      create_gemfile
      create_config_yml
      create_utility_data
      create_calendar_data
      create_projects
      create_weeks
      create_policies
      create_page_stubs
    end

    def starter_path
      @starter_path ||= Pathname.new(File.expand_path("starter_files", __dir__))
    end

    def create_directories
      mkdir_p(SCAFFOLD_DIRECTORIES)
    end

    def create_projects
      for @counter in 1..@project_count do
        process_file("syllabus/_projects/project-#{@counter.to_s.rjust(2,"0")}.md", "syllabus/_projects/project-00.md")
      end
    end

    def create_weeks
      for @counter in 1..@week_count do
        process_file("syllabus/_weeks/week-#{@counter.to_s.rjust(2,"0")}.md", "syllabus/_weeks/week-00.md")
      end
    end

    def create_policies
      Dir.chdir(starter_path) do
        Dir.glob("syllabus/_policies/*.md").each do |f|
          process_file(f)
        end
      end
    end

    def create_gitignore
      process_file(".gitignore")
    end

    def create_gemfile
      process_file("Gemfile")
    end

    def create_config_yml
      process_file("_config.yml")
    end

    def create_calendar_data
      process_file("_data/calendar.yml")
    end

    def create_utility_data
      process_file("_data/utility.yml")
    end

    def create_page_stubs
      SCAFFOLD_PAGE_STUBS.each_with_index do |stub,c|
        @counter = c
        process_file(stub,"index.md")
      end
    end

    def mkdir_p(directories)
      Array(directories).each do |d|
        FileUtils.mkdir_p(path.join(d))
      end
    end

    def render_erb(contents)
      ERB.new(contents, trim_mode: "<>").result binding
    end

    def process_file(output,input=output)
      write_file(output,process_template(input))
    end

    def process_template(filename)
      render_erb(find_template_file(filename).read)
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
