let song 
let img 
let button

let fft
let amplify
let particles = []


function preload() {
  img = loadImage('media/dancingJo.gif')
}

function setup() {
  // put setup code here
  let cnv = createCanvas(windowWidth, windowHeight)

  song = loadSound('media/dowestilldance.mp3', loaded)

  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)

  cnv.mouseClicked(togglePlaying)

  fft = new p5.FFT(0.3)
  // img.filter(BLUR, 12)

  noLoop()
}

const loaded=()=> {
  button = createButton('Dance!')
  button.position(width / 2, height / 2)
  button.mousePressed(togglePlaying)
}


function draw() {
  // put drawing code here
  background(0)

  let r = Math.floor(Math.random() * 255)
  let g = Math.floor(Math.random() * 255)
  let b = Math.floor(Math.random() * 255)

  translate(width / 2, height / 2)

  fft.analyze()

  amplify = fft.getEnergy(20, 200)

  // push()

  if (amplify > 230) {
    rotate(random(-0.5, 0.5))
  }
  image(img, 0, 0, width + 100, height + 100)

  // pop()

  const alpha = map(amplify, 0, 255, 180, 150)
  fill(0, alpha)

  noStroke()
  rect(0, 0, width, height)

  stroke(r, g, b)
  strokeWeight(3)
  noFill()
  
  let wave = fft.waveform()

  for (let t = -1; t <= 1; t+= 2) {
    beginShape()
    for (let i = 0; i <= 180; i+= 0.5) {
      let index = floor(map(i, 0, 180, 0, wave.length - 1))
  
      let radius = map(wave[index], -1, 1, 150, 350)
  
      let x = radius * sin(i) * t
      let y = radius * cos(i) 
  
      vertex(x, y)
    }
  
    endShape()

  }

  let particle = new Particle() 

  particles.push(particle)  

  particles.forEach(particle => {

    if (!particle.edges()) {
      particle.update()
      particle.show()
      particle.update(amplify > 230)
    } else {
      particles.splice(particle, 1)
    }
  })
}



class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.velocity = createVector(0, 0)
    this.acceleration = this.pos.copy().mult(random(0.001, 0.00001))
    this.w = random(3, 9)
    this.red = Math.floor(Math.random() * 255)
    this.green = Math.floor(Math.random() * 255)
    this.blue = Math.floor(Math.random() * 255)

  }

  update(condition) {
    this.velocity.add(this.acceleration)
    this.pos.add(this.velocity)
    if(condition) {
      this.pos.add(this.velocity)
      this.pos.add(this.velocity)
      this.pos.add(this.velocity)
    }
  }

  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2)  {
      return true
    } else {
    return false 
    }
  }

  show() {
    noStroke()
    fill(this.red, this.green, this.blue)
    ellipse(this.pos.x, this.pos.y, this.w)

  }
}

const togglePlaying =()=> {
    if (!song.isPlaying()) {
      song.play()
      loop()
      song.setVolume(0.3)
      button.html("Pause")
    } else {
      song.pause()
      noLoop()
      button.html("Dance!")
    }
  
}
