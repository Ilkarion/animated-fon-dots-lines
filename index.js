(function() {

    let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = innerWidth,
    h = canvas.height = innerHeight,
    //massive в котором храним наши частици
    particles = [],
    //for удобного доступа к визуализации, чкорости частиц, их размер и тому подобное...
    properties = {
        bgColor             : "rgba(15, 17, 19, 1)",
        particleColor       : "rgba(255, 40, 40, 1)",
        particalRadius      : 2,
        particalCount       : 90,
        particalMaxVelocity : 2,
        lineLength          : 150,
        particleLife        : 6 
    }
    document.querySelector('body').appendChild(canvas);
    //хочу что-бы размер canvas динамически менялся относительно окна просмотра
    //поэтому напишу фукнкцию срабатывающую в момент изменения окна
    window.onresize = function(){
        w = canvas.width = innerWidth,
        h = canvas.height = innerHeight;
    }

    class Particle {
        //скорость частиц, цвет, радиус...
        constructor() {
            //положение и скорости
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.velocityX = Math.random() * (properties.particalMaxVelocity*2) - properties.particalMaxVelocity;
            this.velocityY = Math.random() * (properties.particalMaxVelocity*2) - properties.particalMaxVelocity;
            this.life = Math.random() * properties.particleLife*60;
            //60 - частота кадров
        }
        position() {
            /*this.x + this.velocityX > w --> когда точка впервые появится с координатами и к ним прибавим ее будущую позицию будет ли точка выходить за рамки? */ 
            this.x + this.velocityX > w && this.velocityX > 0 || this.velocityX < 0 && this.x + this.velocityX < 0 ? this.velocityX *= -1 : this.velocityX;
            this.y + this.velocityY > h && this.velocityY > 0 || this.velocityY < 0 && this.y + this.velocityY < 0 ? this.velocityY *= -1 : this.velocityY;
            this.x += this.velocityX;
            this.y += this.velocityY;
        }
        reDraw() {
            //будет отрисовывать наши частици на canvas
            ctx.beginPath();
            ctx.arc(this.x, this.y, properties.particalRadius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = properties.particleColor;
            ctx.fill();
        }
        reCalculateLife() {
            if(this.life < 1) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.velocityX = Math.random() * (properties.particalMaxVelocity*2) - properties.particalMaxVelocity;
                this.velocityY = Math.random() * (properties.particalMaxVelocity*2) - properties.particalMaxVelocity;
                this.life = Math.random() * properties.particleLife*60;
            }
            this.life--;
        }
    }

    function reDrawBackground() {
        //цвет заливки
        ctx.fillStyle = properties.bgColor;

        //заливка прямоугольника
        ctx.fillRect(0, 0, w, h)
    }

    function drawLines() {
        //эту функцию вызываем из lood()
        let x1, x2, y1, y2, length, opacity;
        for(let i in particles) {
            for(let p in particles) {
                // this.x === particles[i].x
                x1 = particles[i].x;
                y1 = particles[i].y;
                x2 = particles[p].x;
                y2 = particles[p].y;
                length = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
                opacity = 1 - length/properties.lineLength;
                if(length < properties.lineLength){
                    ctx.lineWidth = '0.5';
                    ctx.strokeStyle = `rgba(255, 40, 40, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
    }

function reDrawParticles() {
    for(let i in particles) {
        particles[i].reCalculateLife();
        particles[i].position();
        particles[i].reDraw();
    }
}

    function loop() {
        reDrawBackground();
        reDrawParticles();
        drawLines();
        requestAnimationFrame(loop);
    }

    function init() {
        //эта функция запускает рекурсивную функцию
        for(let i = 0; i < properties.particalCount; i++) {
            particles.push(new Particle);
        }
        loop();
    }

    init()
})()