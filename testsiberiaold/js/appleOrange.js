Joe = { name: 'Joe' };
Jane = { name: 'Jane' };
Apple = { name: 'apple' };
Orange = { name: 'orange' };
Pear = { name: 'pear' };
function addlike(person, fruit){
    person.likes = person.likes || [];
    fruit.likedBy = fruit.likedBy || [];
    person.likes.push(fruit);
    fruit.likedBy.push(person);
}
addlike(Joe, Apple); addlike(Joe, Orange); addlike(Jane, Apple); addlike(Jane, Pear);
myData = { people: [Joe, Jane], fruits: [Apple, Orange, Pear] };
forest = JSON.Siberia.forestify(myData);
