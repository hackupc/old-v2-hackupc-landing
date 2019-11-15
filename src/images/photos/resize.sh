rm -r multisize
mkdir multisize
for file in *.jpg; do
    for size in 25 50 100 200 400 600 800; do
        convert "$file" -resize $size multisize/"${file%.*}"-"$size"px.jpg
        echo "Resized multisize/"${file%.*}"-"$size"px.jpg"
    done
done
echo "Optimazing images..."
jpegoptim multisize/*.jpeg
echo "Done"
