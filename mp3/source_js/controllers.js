/* Sample Controller */
app
    .run(['$rootScope', '$http', function ($rootScope, $http) {
        $http
            .get('data/imdb250.json')
            .success(function (data) {
                $rootScope.movies = data;
            })
            .error(function (err) {
                console.log(err);
            });

        $rootScope.genres = [
            '',
            'Action',
            'Adventure',
            'Animation',
            'Biography',
            'Comedy',
            'Crime',
            'Drama',
            'Family',
            'Fantasy',
            'Film-Noir',
            'History',
            'Horror',
            'Music',
            'Musical',
            'Mystery',
            'Romance',
            'Sci-Fi',
            'Sport',
            'Thriller',
            'War',
            'Western'
        ];
    }])
    .controller('listController', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $scope.$watch(function () {
            return $rootScope.movies;
        }, function () {
            $scope.movies = $rootScope.movies;
        }, true);
        $scope.predicate = 'rank';
        $scope.order = 'asc';
    }])
    .controller('galleryController', ['$rootScope', '$scope', function ($rootScope, $scope) {
        $scope.$watch(function () {
            return $rootScope.movies;
        }, function () {
            $scope.movies = $rootScope.movies;
        }, true);
        $scope.genres = $rootScope.genres;
        $scope.selectedGenre = '';
        $scope.changeGenre = function (genre) {
            console.log(genre);
            $scope.selectedGenre = genre;
        }
    }])
    .controller('detailsController', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
        var rank = $location.search().rank;
        for (var i = 0; i < $rootScope.movies.length; i++) {
            if ($rootScope.movies[i].rank == rank) {
                $scope.movie = $rootScope.movies[i];
                break;
            }
        }
    }]);