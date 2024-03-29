/*jshint esversion: 6 */

(() => {
    const TWO_PI = 2 * Math.PI;
    const canvas      = document.createElement('canvas');
    const ctx         = canvas.getContext('2d');

    let w             = canvas.width  = innerWidth;
    let h             = canvas.height = innerHeight;
    let canvaColl     = `#232332`;
    let mx            = 0;
    let my            = 0;
    let toggle        = 0;
    let circles       = [];
    let circlesCount  = 4;
    let stepLength    = 2;
    let maxOffset     = 6;
    let maxLength     = 800;

    class Circle {
        constructor(x, y) {
            this.x = x || Math.random() * w;
            this.y = y || Math.random() * h;
        }

        draw(x, y) {
            this.x = x || this.x;
            this.y = y || this.y;

            ctx.lineWidth     = 1.5;
            ctx.fillStyle     = 'white';
            ctx.strokeStyle   = 'red';

            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, TWO_PI);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y, 32, 0, TWO_PI);
            ctx.closePath();
            ctx.stroke();
        }
    }


    function creatLigthing() {
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                let dist = getDistance(circles[i], circles[j]);
                let chance = dist / maxLength;
                
                if (chance > Math.random()) continue;

                let otherColor = chance * 255;
                let stepsCount = dist / stepLength;
                let sx         = circles[i].x;
                let sy         = circles[i].y;

                ctx.lineWidth   = 2.5;
                ctx.strokeStyle = `rgb(255, ${otherColor}, ${otherColor})`;

                ctx.beginPath();
                ctx.moveTo(circles[i].x, circles[i].y);
                for (let c = stepsCount; c > 1; c--){
                    let pathLength = getDistance(circles[i], {x: sx, y: sy});
                    let offset     = Math.sin(pathLength / dist * Math.PI) * maxOffset;

                    sx += (circles[j].x - sx) / c + Math.random() * offset * 2 - offset;
                    sy += (circles[j].y - sy) / c + Math.random() * offset * 2 - offset;

                    ctx.lineTo(sx, sy);
                }
                ctx.stroke();
            }
        }
    }

    function getDistance(a, b) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }

    canvas.onmousemove = e => {
        mx = e.x - canvas.getBoundingClientRect().x;
        my = e.y - canvas.getBoundingClientRect().y;
    };

    window.onkeypress = () => {
        toggle === circles.length - 1? toggle = 0 : toggle++;
    };


    function init() {
        canvas.style.background = canvaColl;
        document.querySelector('body').appendChild(canvas);

        for (let index = 0; index < circlesCount; index++) {
            circles.push( new Circle() );
            
        }
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);
        creatLigthing();

        circles.map( i => { 
            i === circles[toggle]? i.draw(mx, my): i.draw();
        });
        requestAnimationFrame(loop);
    }

    init();
    loop();
})();