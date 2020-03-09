class Student extends User{
    constructor(first, last, patronymic, email, password, birthday, gender, group, student_code, passport_code){
        super(first, last, patronymic, email, password);
        this.birthday = birthday;
        this.gender = gender;
        this.group = group;
        this.student_code = student_code;
        this.passport_code = passport_code;
    }

}