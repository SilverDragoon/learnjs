var authButton      = document.getElementsByClassName('save__button')[0],
    closeButton     = document.getElementsByClassName('close-app')[0],
    searchInputMain = document.getElementsByClassName('search-panel__input')[0],
    searchInputFinal= document.getElementsByClassName('search-panel__input')[1];

var friends      = [],
    frientsFinal = [];

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
    // Получаем список друзей
    VK.api('friends.get', {'order' : 'random', 'fields' : 'photo_50'}, function(response) {
      var list = document.getElementsByClassName('list__items')[0];
          friends = response.response;
      for (var i = 0; i < friends.length; i++) {
        var el = friends[i];
        list.appendChild(viewItemList(el.first_name,el.last_name,el.photo_50))
      }
      searchInputMain.addEventListener('input', function() {
        findFriends(searchInputMain,friends,list,viewItemList)
      })
    })
  })
})


// Функция - шаблон. Вывод друга в список
function viewItemList(firstName, lastName, photo) {
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

  list__plus.addEventListener('click', function() {
    moveItem(firstName,lastName,photo);
  });

  return list__item;
}

// Функция вывода во второй список
function moveItem(firstName,lastName,photo) {
  var fullName = firstName + ' ' + lastName,  
      list__items2 = document.getElementsByClassName('list__items')[1];

  var list__item = document.createElement('div');
      list__item.className = 'list__item';
  var list__avatar = document.createElement('img');
      list__avatar.className = 'list__avatar';
      list__avatar.setAttribute('src', photo);
  var list__name = document.createElement('div');
      list__name.className = 'list__name';
      list__name.innerHTML = fullName;
  var list__cross = document.createElement('div');
      list__cross.className = 'list__cross'; 

  list__item.appendChild(list__avatar);
  list__item.appendChild(list__name);
  list__item.appendChild(list__cross);

  list__items2.appendChild(list__item);

  list__cross.addEventListener('click', function() {
    list__items2.removeChild(list__item);
  });
}

function findFriends(input,peoples,list,viewList) {
  list.innerHTML = '';
  for (var i = 0; i < peoples.length; i++) {
    var fullName = peoples[i].first_name + ' ' + peoples[i].last_name,
        inputText = input.value;
      
    if ( fullName.indexOf(inputText) >= 0 ) {
      list.appendChild(viewList(peoples[i].first_name,peoples[i].last_name,peoples[i].photo_50))
    };
  }
}

if (document.readyState === 'complete') {

}