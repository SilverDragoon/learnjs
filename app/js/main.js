var authButton = document.getElementsByClassName('save__button')[0],
    closeButton= document.getElementsByClassName('close-app')[0];

authButton.addEventListener('click', itemList)

closeButton.addEventListener('click', function() {
  VK.Auth.logout(function() {
    console.log('LogOut')
  })
})

var VkOperations = new Promise(function(resolve, reject) {
  console.log('Auth');
  VK.init({
    apiId: 5395665
  });
  // Авторизация
  VK.Auth.login(function(response){
    // Проверяем состояие авторизации
    if(response.session) {
      resolve(response)
    } else {
      reject(new Error('Авторизация не удалась'))
    }
  }, 2+4+8)
}).then(function(){
  return new Promise(function(resolve, reject) {
    VK.api('users.get', {'name_case' : 'gen', 'fields': 'photo_200,bdate,city'}, function(response) {
      console.log(response);
    })
    VK.api('friends.get', {'order' : 'random', 'fields' : 'photo_50'}, function(response) {
      console.log(response.response);
      for (var i = 0; i < response.response.length; i++) {
        var el = response.response[i];
        document.getElementsByClassName('list__items')[0]
                .appendChild(itemList(el.first_name,el.last_name,el.photo_50))
      }
    })
  })
})

function itemList(firstName, lastName, photo) {
  var fullName = firstName + ' ' + lastName;

  var list__item = document.createElement('div');
      list__item.className = 'list__item';
  var list__avatar = document.createElement('img');
      list__avatar.className = 'list__avatar';
      list__avatar.setAttribute('src', photo);
  var list__name = document.createElement('div');
      list__name.className = 'list__name';
      list__name.innerHTML = fullName;
  var list__plus = document.createElement('div');
      list__plus.className = 'list__plus';

  list__item.appendChild(list__avatar);
  list__item.appendChild(list__name);
  list__item.appendChild(list__plus);

  return list__item;
}