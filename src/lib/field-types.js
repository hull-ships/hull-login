import t, { Str, Boolean } from 'tcomb-form';

function isEmail(value) {
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value);
}

function isUsername(value) {
  return /^[a-z0-9_]+$/i.test(value);
}

function minLength(length) {
  return function(value) {
    return value && value.length >= length;
  };
}

const Email = t.subtype(Str, isEmail);

const Username = t.subtype(Str, isUsername);

const Login = t.subtype(Str, function(value) {
  return isUsername(value) || isEmail(value);
});

const Password = t.subtype(Str, minLength(1));

const Name = t.subtype(Str, minLength(1));


export default { Email, Username, Login, Password, Name, Boolean };

