module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        preprocess: {
            js: {
                src: 'src/build/default.js',
                dest: 'dist/bloqs.js'
            },
            dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= preprocess.dest %>']
                }
            }
        },
        jshint: {
            files: ['dist/bloqs.js'],
            options: {
                globals: {
                    console: true,
                    module: true,
                    document: true
                },
                jshintrc: '.jshintrc'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['preprocess', 'jshint', 'uglify']);
};