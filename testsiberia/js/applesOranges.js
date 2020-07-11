var Joe = { name: 'Joe' }, Jane = { name: 'Jane' }, Apple = { name: 'Apple' }, Orange = { name: 'Orange' }, Pear = { name: 'Pear' };
function addlike(person, fruit){
    person.likes = person.likes || []; fruit.likedBy = fruit.likedBy || [];
    person.likes.push(fruit); fruit.likedBy.push(person);
}
addlike(Joe, Apple);addlike(Joe, Orange);addlike(Jane, Apple);addlike(Jane, Pear);
var Chief = { people: [Joe, Jane], fruits: [Apple, Orange, Pear] };
var frozChief = JSON.SiberiaSimple.forestify(Chief);