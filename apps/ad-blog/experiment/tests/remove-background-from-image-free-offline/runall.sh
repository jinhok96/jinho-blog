for m in u2netp u2net silueta u2net_human_seg isnet-general-use birefnet-general-lite birefnet-general bria-rmbg; do
  [ -f res/$m.json ] || /tmp/rb/bin/python bench.py $m > res/$m.log 2>&1
done
echo ALLDONE > res/done
