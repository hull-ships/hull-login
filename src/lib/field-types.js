import t from 'tcomb-form';

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

const Email = t.subtype(t.Str, isEmail);

const Username = t.subtype(t.Str, isUsername);

const Login = t.subtype(t.Str, function(value) {
  return isUsername(value) || isEmail(value);
});

const Password = t.subtype(t.Str, minLength(1));

const Name = t.subtype(t.Str, minLength(1));

export default { Email, Username, Login, Password, Name };

