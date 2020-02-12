rm -r multisize
mkdir multisize
for file in *.jpg; do
    for size in 25 50 100 200 400 600 800; do
        convert "$file" -resize $size multisize/"${file%.*}"-"$size"px.jpg
        echo "Resized multisize/"${file%.*}"-"$size"px.jpg"
        jpegoptim "multisize/"${file%.*}"-"$size"px.jpg"
        echo "Optimized multisize/"${file%.*}"-"$size"px.jpg"
    done
done
echo "Encoding images as WebP"
for file in multisize/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done
echo "Done"
