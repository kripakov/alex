var mapNameProf = function () {
    emit(this.name,this.prof);
};

var mapNameMessage = function(){
	emit(this.name,this.message);
}

var mapNameSecondName = function(){
	emit(this.name,this.secondName);
};

var reduce = function (vals) {
    return vals;
};

exports.mapNameProf = mapNameProf;
exports.mapNameMessage = mapNameMessage;
exports.mapNameSecondName = mapNameSecondName;
exports.reduce = reduce;