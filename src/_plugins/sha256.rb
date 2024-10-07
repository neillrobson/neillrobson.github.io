require 'digest'

module Jekyll
    module SHA256
        def sha256(input)
            Digest::SHA256.hexdigest(input)
        end
    end
end

Liquid::Template.register_filter(Jekyll::SHA256)
