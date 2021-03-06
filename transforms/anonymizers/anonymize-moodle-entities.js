const randomName = require('./random-names.js').randomName;

console.log("**** Starting Moodle Entity anonymization.... ");


// Student data changes
const USER_TYPE = 'http://purl.imsglobal.org/caliper/v1/lis/Person';
const USER_FIRST_NAME_FIELD = 'firstName';
const USER_LAST_NAME_FIELD = 'lastName';
const USER_EMAIL_FIELD = 'email';
const USER_ID_FIELD = '@id';
const USER_PHONE_NUMBER_FIELD = 'phone';
const USER_MOBILE_PHONE_NUMBER_FIELD = 'mobilePhone';
const USER_ADDRESS_FIELD = 'address';
const USERNAME_FIELD = 'userName';
const USER_INSTITUTION_NAME_FIELD = 'institutionName';
// Values
const USER_PHONE_NUMBER = '555-555-5555';
const USER_MOBILE_PHONE_NUMBER = '555-555-6666';
const USER_ADDRESS = '51 Nellcheer Street, Plano, TX 72320';
var USER_INSTITUTION_NAME = "Lambda University";
var USER_COUNTRY_FIELD = "country";
var USER_COUNTRY = "USA";
var USER_TIMEZONE_FIELD = "timeZone";
var USER_TIMEZONE = "CST";
var USER_DEPARTMENT_FIELD = "department";
var USER_DEPARTMENT = "None";

//  Course data changes
const COURSE_TYPE = 'http://purl.imsglobal.org/caliper/v1/lis/CourseOffering';
const COURSE_ID_FIELD = '@id';
const COURSE_NAME_FIELD = 'name';
const COURSE_CATEGORY_TYPE = 'http://purl.imsglobal.org/caliper/v1/lis/Group';
const COURSE_CATEGORY_ID_FIELD = '@id';
const COURSE_CATEGORY_NAME_FIELD = 'name';

const EMAIL_DOMAIN = '@lambda.edu'

// EdApp data changes
const EDAPP_FIELD = 'edApp';
// Values
const EDAPP = {
    "@context": "http://purl.imsglobal.org/ctx/caliper/v1/Context",
    "@id": "https://moodle.lambda.edu",
    "@type": "http://purl.imsglobal.org/caliper/v1/SoftwareApplication",
    "name": USER_INSTITUTION_NAME
}

//  Generic data changes
const ENV_ID_FIELD = 'envId';
const ACCOUNT_ID_FIELD = 'accountId';
const SENSOR_ID_FIELD = 'sensorId';
const API_KEY_FIELD = 'apiKey';
// Values
const ACCOUNT_ID = 'sales';
const ENV_ID = 'sales3';
const SENSOR_ID = 'c28e3d67-818f-49d5-bf1f-3f188f2c440b';
const API_KEY = 'bsTvWK_-Rl-gZnnQ5de79w';

const mappedNames = {};
const mappedCourseNames = {};
const mappedCourseCategoryNames = {};

function anonymize(doc, options) {

    if (doc.entity['@type'] === USER_TYPE) {
        return anonymizeUserEntity(doc, options);
    } else if (doc.entity['@type'] === COURSE_TYPE) {
        return anonymizeCourseEntity(doc, options);
    } else if (doc.entity['@type'] === COURSE_CATEGORY_TYPE) {
        return anonymizeCourseCategoryEntity(doc, options);
    } else {
        anonymizeAnyEntity(doc, options);
    }
}

function anonymizeUserEntity(doc, options) {

    var currentMappingKey = doc.entity[USER_ID_FIELD] + "::" + doc.entity.extensions[USER_FIRST_NAME_FIELD] + "::" + doc.entity.extensions[USER_LAST_NAME_FIELD];

    if (!mappedNames[currentMappingKey]) {
        mappedNames[currentMappingKey] = randomName();
    }

    var currentMappedNameRecord = mappedNames[currentMappingKey];
    // console.log("mapping " + currentMappingKey + " to " + JSON.stringify(currentMappedNameRecord));

    doc.entity.extensions[USER_FIRST_NAME_FIELD] = currentMappedNameRecord.firstName;
    doc.entity.extensions[USER_LAST_NAME_FIELD] = currentMappedNameRecord.lastName;
    var userName = currentMappedNameRecord.firstName.substring(0, 3) + currentMappedNameRecord.lastName;
    doc.entity.extensions[USER_EMAIL_FIELD] = userName + EMAIL_DOMAIN;
    doc.entity.extensions[USERNAME_FIELD] = userName;
    doc.entity.extensions[USER_INSTITUTION_NAME_FIELD] = USER_INSTITUTION_NAME;
    doc.entity.extensions[USER_PHONE_NUMBER_FIELD] = USER_PHONE_NUMBER;
    doc.entity.extensions[USER_MOBILE_PHONE_NUMBER_FIELD] = USER_MOBILE_PHONE_NUMBER;
    doc.entity.extensions[USER_ADDRESS_FIELD] = USER_ADDRESS;
    doc.entity.extensions[USER_COUNTRY_FIELD] = USER_COUNTRY;
    doc.entity.extensions[USER_TIMEZONE_FIELD] = USER_TIMEZONE;
    doc.entity.extensions[USER_DEPARTMENT_FIELD] = USER_DEPARTMENT;

    anonymizeAnyEntity(doc, options);

    return doc;
}

var courseNameId = 0;

function anonymizeCourseEntity(doc, options) {

    var currentMappingKey = doc.entity[COURSE_ID_FIELD] + "::" + doc.entity[COURSE_NAME_FIELD];

    if (!mappedCourseNames[currentMappingKey]) {
        mappedCourseNames[currentMappingKey] = 'Course' + courseNameId++;
    }

    doc.entity[COURSE_NAME_FIELD] = mappedCourseNames[currentMappingKey];

    anonymizeAnyEntity(doc, options);
}

var courseCategoryId = 0;

function anonymizeCourseCategoryEntity(doc, options) {

    var currentMappingKey = doc.entity[COURSE_CATEGORY_ID_FIELD] + "::" + doc.entity[COURSE_CATEGORY_NAME_FIELD];

    if (!mappedCourseCategoryNames[currentMappingKey]) {
        mappedCourseCategoryNames[currentMappingKey] = 'Category' + courseCategoryId++;
    }

    doc.entity[COURSE_CATEGORY_NAME_FIELD] = mappedCourseCategoryNames[currentMappingKey];

    anonymizeAnyEntity(doc, options);
}

function anonymizeAnyEntity(doc, options) {

    doc.entity.extensions[EDAPP_FIELD] = EDAPP;
    doc[ACCOUNT_ID_FIELD] = ACCOUNT_ID;
    doc[ENV_ID_FIELD] = ENV_ID;
    doc[SENSOR_ID_FIELD] = SENSOR_ID;
    doc[API_KEY_FIELD] = API_KEY;

    return doc;
}

module.exports = function(doc, options = {}) {
    anonymize(doc._source, options)
}