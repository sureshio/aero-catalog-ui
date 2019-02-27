angular.module('heritageApp')
    .controller('QuizIndexCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$uibModal',
        '$timeout',
        '$stateParams',
        'SweetAlert',
        'Config',
        'store',
        'QuestionFactory',
        'DashboardFactory',
        'QuizFactory',
        function ($scope, $rootScope, $state, $uibModal, $timeout, $stateParams, SweetAlert, Config,store, QuestionFactory, DashboardFactory, QuizFactory) {
            'use strict';

            var vm = this;

            function errorCallback(response) {
                if (response.data.message) {
                    SweetAlert.swal('Error', response.data.message, 'error');
                } else {
                    SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                }
            }

            function successCallback(response) {
                response.data.questions.forEach(function (element, index, array) {
                    var row = {
                        id: element.id,
                        text: element.text,
                        isTrueFalse: element.isTrueFalse,
                        options: []
                    };
                    for(var i = 0; i < element.options.length; i += 1) {
                        row.options.push(element.options[i]);
                    }
                    row.options = shuffle(row.options);
                    vm.session.questions.push(row);
                });
                vm.session.questions = shuffle(vm.session.questions);

                if($stateParams.type === Config.QUIZ_CONTD) {
                    vm.session.total.questions = vm.session.questions.length + response.data.correct + response.data.wrong;
                    vm.session.total.correct = response.data.correct;
                    vm.session.total.wrong = response.data.wrong;
                    vm.session.total.attempted = response.data.correct + response.data.wrong + 1;
                } else {
                    vm.session.total.questions = vm.session.questions.length;
                }

                vm.session.current.question = vm.session.questions[0];
                vm.loadingDiv = false;
            }

            function shuffle(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;
                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }

                return array;
            }

            function loadAllRemainingQuestionsByQuestionSetId(argQuestionsetID) {
                QuestionFactory.resumeExam(argQuestionsetID).then(successCallback, errorCallback);
            }

            function loadAllQuestionsByQuestionSetId(argQuestionSetID) {
                QuestionFactory.findByQuestionSetID(argQuestionSetID).then(successCallback, errorCallback);
            }

            function forward() {
                if (vm.session.isBackButtonClicked) {
                    vm.session.current.index += 1;
                    vm.session.current.question = vm.session.questions[vm.session.current.index];
                    vm.session.current.answer = '';
                    vm.session.isBackButtonClicked = false;
                } else {
                    var result = vm.session.current.question.options.filter(function (option) {
                        return (option.key === 0)
                    });

                    SweetAlert.swal({
                            title: "Info",
                            text: 'Correct Answer is ' + result[0].value,
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonColor: "#A5DC86",
                            confirmButtonText: "Ok",
                            closeOnConfirm: true
                        },
                        function (isConfirm1) {
                            if (isConfirm1) {
                                if(vm.session.current.index < vm.session.questions.length - 1) {
                                    vm.session.current.index += 1;
                                    vm.session.current.question = vm.session.questions[vm.session.current.index];
                                    vm.session.current.answer = '';
                                    vm.session.total.wrong += 1;
                                    vm.session.total.attempted += 1;
                                } else {
                                    var data = {
                                        questionSet:{
                                            id: $stateParams.id
                                        },
                                        playerScore: vm.session.total.correct * Config.SCORE_WEIGHT
                                    };

                                    QuizFactory.complete(data).then(function(response) {
                                        SweetAlert.swal({
                                                title: "Info",
                                                text: response.data.message,
                                                type: "success",
                                                showCancelButton: false,
                                                confirmButtonColor: "#A5DC86",
                                                confirmButtonText: "Ok",
                                                closeOnConfirm: true
                                            },
                                            function (isConfirm2) {
                                                if (isConfirm2) {
                                                    $state.go('home', null, {notify: false}).then(function(state) {
                                                        $rootScope.$broadcast('$stateChangeSuccess', state, null);
                                                    });
                                                }
                                            });
                                    }, errorCallback);
                                }
                            }
                        });
                }
            }

            function showTextBoxModal(argInputLabel) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'modalTextBox.html',
                    controller: function($scope, $uibModalInstance, inputLabel, userName) {
                        $scope.ok = function () {
                            $uibModalInstance.close($scope.player);
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };

                        function init() {
                            $scope.inputLabel = inputLabel;
                            $scope.player = {
                                name: userName
                            };
                        }

                        init();
                    },
                    size: 'sm',
                    resolve: {
                        inputLabel: function() {
                            return argInputLabel;
                        },
                        userName: function() {
                            var split = vm.info.token.split(':');
                            return split[0];
                        }
                    }
                });

                modalInstance.result.then(function (player) {
                    var data = {
                        questionSetID: $stateParams.id,
                        playerScore: vm.session.total.correct * Config.SCORE_WEIGHT,
                        playerName: player.name
                    };
                    QuizFactory.registerHighScore(data).then(function(response) {
                        $state.go('home');
                    }, errorCallback);
                }, function () {
                    QuizFactory.deleteSession($stateParams.id).then(function() {
                        $state.go('home');
                    }, errorCallback);
                });
            }

            function init() {
                vm.loadingDiv = true;
                vm.info = {};
                if (store.get('info')) {
                    vm.info = angular.fromJson(store.get('info'));
                }

                vm.session = {
                    id: '',
                    questionSet: {
                        id: $stateParams.id
                    },
                    player: {
                        id: vm.info.userId
                    },
                    questions: [],
                    current: {
                        index: 0,
                        question: {},
                        isAttempted: false,
                        answer: ''
                    },
                    total: {
                        questions: 0,
                        attempted: 1,
                        correct: 0,
                        wrong: 0
                    },
                    skipped: [],
                    attempted: [],
                    isBackButtonClicked: false
                };

                if ($stateParams.type === Config.QUIZ_NEW) {
                    loadAllQuestionsByQuestionSetId($stateParams.id);
                } else {
                    loadAllRemainingQuestionsByQuestionSetId($stateParams.id);
                }
            }

            init();

            vm.showCorrectAnswer = function (argQuestion) {
                if (argQuestion.options) {
                    var results = argQuestion.options.filter(function (option) {
                        return (option.key === 0);
                    });
                    return results[0].value;
                }
                return null;
            }

            vm.previous = function () {
                vm.session.isBackButtonClicked = true;
                vm.session.current.index -= 1;
                vm.session.current.question = vm.session.questions[vm.session.current.index];
                vm.session.current.answer = '';
            };

            vm.next = function () {
                if (vm.session.current.answer) {
                    var results = vm.session.current.question.options.filter(function(option) {
                       return (option.key == vm.session.current.answer);
                    });

                    vm.session.attempted.push({questionId: vm.session.current.question.id, answerId: results[0].id});

                    if (parseInt(vm.session.current.answer) === 0) {
                        vm.session.current.index += 1;
                        vm.session.current.question = vm.session.questions[vm.session.current.index];
                        vm.session.current.answer = '';
                        vm.session.total.correct += 1;
                        vm.session.total.attempted += 1;
                    } else if (vm.session.current.answer < 0) {
                        forward();
                    }
                } else {
                    vm.session.skipped.push(vm.session.current.question.id);
                    forward();
                }
            };

            $scope.$watch('vm.session.current.answer', function (newValue, oldValue) {
                if(newValue) {
                    var results = vm.session.current.question.options.filter(function(option) {
                        return (option.key == newValue);
                    });
                    vm.session.attempted.push({questionId: vm.session.current.question.id, answerId: results[0].id});
                }

                if (parseInt(newValue) === 0) {
                    if(vm.session.current.index < vm.session.questions.length - 1) {
                        $timeout(function () {
                            vm.session.current.index += 1;
                            vm.session.current.question = vm.session.questions[vm.session.current.index];
                            vm.session.current.answer = '';
                            vm.session.total.correct += 1;
                            vm.session.total.attempted += 1;
                        }, 500);
                    } else {
                        var data = {
                            questionSet:{
                                id: $stateParams.id
                            },
                            playerScore: vm.session.total.correct * Config.SCORE_WEIGHT
                        };

                        QuizFactory.complete(data).then(function(response) {
                            SweetAlert.swal({
                                    title: "Info",
                                    text: response.data.message,
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonColor: "#A5DC86",
                                    confirmButtonText: "Ok",
                                    closeOnConfirm: true
                                },
                                function (isConfirm) {
                                    if (isConfirm) {
                                        $state.go('home', null, {notify: false}).then(function(state) {
                                            $rootScope.$broadcast('$stateChangeSuccess', state, null);
                                        });
                                    }
                                });
                        }, errorCallback);
                    }
                } else if (parseInt(newValue) < 0) {
                    forward();
                }
            });

            vm.endQuiz = function () {
                var quizData = {
                    questionSetID: $stateParams.id,
                    score: vm.session.total.correct * Config.SCORE_WEIGHT
                };
                QuizFactory.evaluateScore(quizData).then(function (response) {
                    if (response.data.isHighScore) {
                        showTextBoxModal(response.data.message);
                    } else {
                        SweetAlert.swal({
                                title: "Info",
                                text: response.data.message,
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#A5DC86",
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    $state.go('home', null, {notify: false}).then(function(state) {
                                        $rootScope.$broadcast('$stateChangeSuccess', state, null);
                                    });
                                }
                            });
                    }
                }, errorCallback);
            };

            vm.stopQuiz = function() {
                SweetAlert.swal({
                        title: "Warning",
                        text: 'Your answering is not completed. are you sure to stop at this position of Question Set?',
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#A5DC86",
                        confirmButtonText: "Ok",
                        closeOnConfirm: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            var sessionData = {
                                id: vm.session.id,
                                questionSet: {
                                    id: $stateParams.id
                                },
                                total: {
                                    correct: vm.session.total.correct,
                                    wrong: vm.session.total.wrong
                                },
                                attempted: vm.session.attempted,
                                skipped: vm.session.skipped
                            };
                            QuizFactory.createSession(sessionData).then(function(response) {
                                $state.go('home');
                            }, errorCallback);
                        }
                    });
            };
        }]);
