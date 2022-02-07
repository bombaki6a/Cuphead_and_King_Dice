// Get image function:
export default function image(path) {
    var img = new Image();
    img.src = path;

    return img;
}
