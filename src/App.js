import './App.css';
import kaboom from 'kaboom';


const k = kaboom({
  global: true,
  fullscreen: false,
  scale: 1.5,
  clearColor: [0, 0, 0, 0],
  background: [],

});

let isJumping = true;
let isBig = false;

k.loadRoot('https://i.imgur.com/');

k.loadSprite('blockOrange', 'pogC9x5.png');
k.loadSprite('mob', 'LmseqUG.png');
k.loadSprite('floor', '3e5YRQd.png');
k.loadSprite('coin', 'wbKxhcd.png');
k.loadSprite('boxHidden', 'RMqCc1G.png');
k.loadSprite('gumba', 'LmseqUG.png');
k.loadSprite('boxOpen', 'bdrLpi6.png');
k.loadSprite('mushroom', '0wMd92p.png');
k.loadSprite('boxHiddenMushroom', 'RMqCc1G.png');
k.loadSprite('brick', 'M6rwarW.png');


k.loadSprite('mario', 'OzrEnBy.png', {
  sliceX: 3.9,
  anims: {
    idle: {
      from: 0,
      to: 0,
    },
    move: {
      from: 1,
      to: 2
    }
  }
});





let score = 0;

const scoreLabel = k.add([
  k.text('Coins: ' + score, 10),
  k.pos(90),
  k.layer('ui'),
  {
    value: score
  }
])

function big(){

  return{
    isBig(){
      return isBig;
    },
    smallify(){
      this.scale = k.vec2(1);
      isBig = false;
    }, 
    biggify(){
      this.scale = k.vec2(2);
      isBig = true;
    }
  }
}

const player = k.add([
  k.sprite('mario', {
    animSpeed: 0.1,
    frame: 0
  }),
  k.pos(20, 10),
  k.area(),
  k.body(),
  k.solid(),
  big(),
  k.origin('bot')
])

k.onKeyDown("space", () => {

  if (player.isGrounded()) {
    player.jump(650);
    isJumping = true;
  }
});

k.onKeyDown('d', () => {

  player.flipX(false);
  player.move(120, 0);
});

k.onKeyDown('a', () => {

  player.flipX(true);
  player.move(-120, 0);
});

k.keyPress('d', ()=>{

  player.flipX(false);
  player.play('move');
});

k.keyPress('a', ()=>{

  player.flipX(true);
  player.play('move');
});

k.keyRelease('d', ()=>{

  player.play('idle');
});

k.keyRelease('a', ()=>{

  player.play('idle');
})


var gameLevel = k.addLevel(
  [
    "= 0                        $=",
    "=                          $=",
    "=                          $=",
    "=                          $=",
    "=                          $=",
    "=                          $=",
    "=                          $=",
    "=           $$         =   $=",
    "=  %      =8==?=   =       $=",
    "=                      =   $=",
    "=             @@= > = ===  &=",
    "=============================",
  ], {
  // define the size of each block
  width: 32,
  height: 32,
  // define what each symbol means, by a function returning a component list (what will be passed to add())
  "=": () => [
    k.sprite("brick"),
    k.area(),
    k.solid(),
    k.scale(1.5),
    'brick'
  ],
  "$": () => [
    k.sprite("coin"),
    k.area(),
    k.pos(0, -9),
    k.solid(),
    'coin',
  ],
  "?": () => [
    k.sprite('boxHidden'),
    k.area(),
    k.solid(),
    k.scale(0.8),
    'boxHidden'
  ],
  "@": () => [
    k.sprite('gumba'),
    k.area(),
    k.body(),
    k.solid(),
    'gumba',
  ],
  "^": () => [
    k.sprite("mario"),
    k.area(),
    "danger",
  ],
  "0": () =>[
    k.sprite('boxOpen'),
    k.area(),
    k.solid(),
    k.scale(1.5),
    'boxOpen',
  ],
  "9": () =>[
    k.sprite('mushroom'),
    k.area(),
    k.solid(),
   
    
    'mushroom'
  ],
  "8": () =>[
    k.sprite('boxHiddenMushroom'),
    k.area(),
    k.solid(),
    k.scale(0.8),
    'boxHiddenMushroom'
  ],

});

k.onUpdate('gumba', (obj)=>{

  obj.move(-20);
});

player.onUpdate(()=>{

  if(player.isGrounded()){

    isJumping = false;
  }
});

player.on('headbutt', (obj)=>{

  if(obj.is('surpriseCoin')){
    gameLevel.spawn('$', obj.gridPos.sub(0,1));
    k.destroy(obj);
  }
  
  if(obj.is('brick')){

    k.destroy(obj);
  }

  if(obj.is('coin')){

    k.destroy(obj);
    score += 1;

    scoreLabel.value += 1;
    scoreLabel.text = 'Coins: ' + score;
    
  }

  if(obj.is('boxHiddenMushroom')){
    gameLevel.spawn('9', obj.gridPos.sub(0,1));
    k.destroy(obj);
  }

  if(obj.is('boxHidden')){
    k.destroy(obj);
    gameLevel.spawn('0', obj.gridPos.sub(0,0));
  }
});

player.onUpdate(()=>{

  k.camPos(player.pos)
})

k.onUpdate('mushroom', (obj)=>{

  obj.move(20,0);
});

player.onCollide('mushroom', (obj)=>{
  k.destroy(obj);
  player.biggify();
});

player.onCollide('coin', (obj)=>{

  obj.destroy();
  score += 1;
  scoreLabel.text = 'Coins: ' + score;
})

player.onCollide('gumba', (obj)=>{

  if(isJumping){
    k.destroy(obj);
  }else{
    if(isBig){
      player.smallify();
    }else{
      k.go('loose');
    }
  }

})





















k.scene('loose', ()=>{
  k.add([ k.text('Game Over \n Score: ' + score , 18),
  k.origin('center'),
  k.pos(k.width()/2, k.height()/2)
])

})






function App() {
  return (
    <div>

    </div>
  );
}

export default App;
