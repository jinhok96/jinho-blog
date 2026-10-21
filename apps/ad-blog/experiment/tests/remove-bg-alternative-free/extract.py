import io, sys, random, collections, pyarrow.parquet as pq
from PIL import Image
QUOTA = {'animal': 6, 'portrait': 5, 'plant': 3, 'furniture': 2, 'toy': 2, 'fruit': 2}
t = pq.read_table('/tmp/bgdata/aim.parquet', columns=['image_name','category','type'])
names=t.column('image_name').to_pylist(); cats=t.column('category').to_pylist(); types=t.column('type').to_pylist()
by=collections.defaultdict(list)
for i,(n,c) in enumerate(zip(names,cats)): by[c].append((n,i))
rng=random.Random(20261021); picked=[]
for c,k in QUOTA.items(): picked += [i for _,i in rng.sample(sorted(by[c]),k)]
full=pq.read_table('/tmp/bgdata/aim.parquet')
import os; os.makedirs('in',exist_ok=True); os.makedirs('gt',exist_ok=True)
for i in sorted(picked):
    r=full.slice(i,1).to_pylist()[0]
    img=Image.open(io.BytesIO(r['image']['bytes'])).convert('RGB')
    base=r['image_name'].rsplit('.',1)[0]
    img.save(f'in/{base}.jpg',quality=95)
    Image.open(io.BytesIO(r['mask']['bytes'])).convert('L').save(f'gt/{base}.png')
    print(base, r['category'], r['type'], img.size)
