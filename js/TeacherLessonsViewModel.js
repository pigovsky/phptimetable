function TeacherLessonsViewModel() 
{	
	this.teachersDIV = document.getElementById("teachers");
	this.teacherCount = 1;
	this.teacherTimetable = new TeacherTimetable();	
	this.teacherTimetable.addAutocomplete(1);
}

var _p = TeacherLessonsViewModel.prototype;

_p.getTeachers = function(){
	var teachers=[];
	for(var i=1; i<=this.teacherCount; i++) {
		teachers.push($('#'+AUTOCOMPLETE_ID+i).val());
	}
	return teachers;
};

_p.getTeacherIds = function(){
	var ids=[];
	var teachers = this.getTeachers();
	this.teacherTimetable.teachers.forEach(function(t){
		if(teachers.indexOf(t.value)>=0){
			ids.push(t.id);
		}
	});
	return ids;
};
	
_p.setTeachers = function(teachers){
	for(var i=1; i<=this.teacherCount; i++) {
		$('#'+AUTOCOMPLETE_ID+i).val(teachers[i-1]);
		this.teacherTimetable.addAutocomplete(i);
	}
};		
			
_p.readLessons = function(){ 
	var me = this;
	$.ajax({
		type: "GET",
		url: 'joint.php',
		data: {teacher: JSON.stringify(me.getTeacherIds()) } 
	})
	.done(function( msg ) {
		console.log(msg);
		msg = JSON.parse(msg);						
		me.teacherTimetable.print(msg)
	  })
	.fail(function(msg){ 
		me.teacherTimetable.error("cannot read lessons");
	} );
};
	
_p.addTeacher = function(){
	this.teacherCount++;
	var id = '"autocomplete'+this.teacherCount+'"';
	var teachers = this.getTeachers();
	this.teachersDIV.innerHTML+='<p><label for='+id+'>Викладач: </label>' +
		"<input id="+id+"/></p>";	
	this.teacherTimetable.addAutocomplete(this.teacherCount);
	this.setTeachers(teachers);
};

ko.applyBindings(new TeacherLessonsViewModel());
