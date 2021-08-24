import gsap from "gsap";
// see all gsap attributes
// console.log(gsap)

// Animation for fading in
export const fadeIn = (element) => {
  gsap.to(element, 1, {
    opacity: 1,
    ease: "power4.out",
    stagger: {
      amount: 0.3,
    },
  });

  gsap.fromTo(element, 
        {
          x: -100,
        }, 
        { 
          x: 0
        }
  );
};

// Animation for fading out
export const fadeOut = (element) => {
  gsap.to(element, 1, {
    opacity: 0,
    ease: "power4.out",
  });

  gsap.fromTo(element, 
        {
          x: 0,
        }, 
        { 
          x: -100
        }
  );
};


// Animation for getting in
export const getIn = (element) => {
  gsap.to(element, 
    {
     opacity: 1,
     ease: "power4.out",
    }
  );
};

// Animation for getting out
export const getOut = (element) => {
  gsap.to(element, 
    { 
      opacity: 0.7,
      ease: "power4.out",
    }
  );
};


// Animation to place success message in the page  
// and remove thereafter

export const successMsg = (element) => {

  gsap.fromTo(element, 
        {
          autoAlpha: 1,
          display:"flex"
        }, 
        { 
          autoAlpha: 0,
          delay:3,
          display:"none"
        }
  );

}


// Animation to place success message in the page  
// and remove thereafter

export const errorMsg = (element) => {

  gsap.fromTo(element, 
        {
          autoAlpha: 0,
          display:"flex"
        }, 
        { 
          autoAlpha: 1,
        }
  );

}