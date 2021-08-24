export const scrollTop = () =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
};

export const scrollBottom = (ref) =>{
    // window.scrollTo({bottom: 0, behavior: 'smooth'});
    ref.scrollTop = ref.scrollHeight - ref.clientHeight;
};