require 'kramdown/parser/gfm'

class Kramdown::Parser::NeillKramdown < Kramdown::Parser::GFM

    def initialize(source, options)
        super
        @block_parsers.unshift(:layout_tag)
    end

    LAYOUT_TAG = /^#{OPT_SPACE}\{([<>\|]{1,3})\} ?/

    CLASSES = {
        '<<' => 'wide left',
        '>>' => 'wide right',
        '<>' => 'wide',
        '<' => 'inside left',
        '>' => 'inside right',
        '|<' => 'margin left',
        '>|' => 'margin right',
        '||' => 'column two',
        '|||' => 'column three',
    }

    # Note that @src is a Kramdown StringScanner, which is just a Ruby
    # StringScanner augmented with line number information.
    def parse_layout_tag
        if @src.check(LAYOUT_TAG)
            div_class = CLASSES[@src[1]]
            if div_class == nil
                return false
            end

            start_line_number = @src.current_line_number
            result = @src.scan(PARAGRAPH_MATCH)
            until @src.match?(self.class::LAZY_END)
                result << @src.scan(PARAGRAPH_MATCH)
            end
            result.gsub!(LAYOUT_TAG, '')

            el = new_block_el(:html_element, 'div', { :class => div_class }, category: :block, location: start_line_number)
            @tree.children << el
            parse_blocks(el, result)
            true
        else
            false
        end
    end
    define_parser(:layout_tag, LAYOUT_TAG)

end

class Kramdown::Converter::Html5 < Kramdown::Converter::Html

    def convert_p(el, indent)
        if el.options[:transparent]
            inner(el, indent)
        # Check if the paragraph only contains an image and treat it as a figure instead.
        elsif !el.children.nil? && el.children.count == 1 && el.children.first.type == :img
            convert_figure(el.children.first, indent)
        else
            format_as_block_html(el.type, el.attr, inner(el, indent), indent)
        end
    end

    def convert_figure(el, indent)
        "#{' '*indent}<figure><img#{html_attributes(el.attr)} />#{(el.attr['title'] ? "<figcaption>#{el.attr['title']}</figcaption>" : "")}</figure>\n"
    end

end

class Jekyll::Converters::Markdown::NeillKramdown
    def initialize(config)
        require 'kramdown'
        @config = config
    rescue LoadError
        STDERR.puts 'You are missing a library required for Markdown. Please run:'
        STDERR.puts '  $ [sudo] gem install kramdown'
        raise FatalException.new("Missing dependency: kramdown")
    end

    def convert(content)
        Kramdown::Document.new(content, {input: 'NeillKramdown', hard_wrap: false}).to_html5
    end
end
