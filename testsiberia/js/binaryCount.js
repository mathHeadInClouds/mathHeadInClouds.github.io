function binaryCount(level){
    function count(stack){
        if (stack.length>=level){
            console.log(stack.join(''));
        } else {
            count(stack.concat(0));
            count(stack.concat(1));
        }
    }
    count([]);
}
binaryCount(3)

function binaryCount2(level){
    var stack = [];
    function count(){
        if (stack.length>=level){
            console.log(stack.join(''));
        } else {
            stack.push(0); count(); stack.pop();
            stack.push(1); count(); stack.pop();
        }
    }
    count();
}

function countNoRec(level){
    var stack = fiat.util.range(level).map(function(){return 0;});
    while (true){
        console.log(stack.join(''));
        var position = stack.length-1;
        while (true){
            if (stack[position]===0) break;
            position--;
            if (position<0) return;
        }
        stack[position]=1;
        while (true){
            ++position;
            if (position>=stack.length) break;
            stack[position]=0;
        }
    }
}

function countNoRec2(level){
    var stack = [];
    while (true){
        while (stack.length<level){ stack.push(0); }
        console.log(stack.join(''));
        while (true){
            if (stack.length===0) return;
            if (stack.pop()===0) break;
        }
        stack.push(1);
    }
}

