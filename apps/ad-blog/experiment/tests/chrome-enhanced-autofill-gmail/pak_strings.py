import struct, sys
def read_pak(path):
    d=open(path,'rb').read()
    ver=struct.unpack('<I',d[:4])[0]
    if ver==5:
        enc,res_count,alias_count=struct.unpack('<BxxxHH',d[4:12]); off=12
    else:
        res_count,enc=struct.unpack('<IB',d[4:9]); alias_count=0; off=9
    entries=[]
    for i in range(res_count+1):
        rid,o=struct.unpack('<HI',d[off+i*6:off+i*6+6]); entries.append((rid,o))
    out={}
    for i in range(res_count):
        rid,o=entries[i]; nxt=entries[i+1][1]
        out[rid]=d[o:nxt]
    aoff=off+(res_count+1)*6
    for i in range(alias_count):
        rid,idx=struct.unpack('<HH',d[aoff+i*4:aoff+i*4+4]); out[rid]=out[entries[idx][0]]
    return out
if __name__=='__main__':
    r=read_pak(sys.argv[1])
    for k in sorted(r):
        v=r[k]
        try: s=v.decode('utf-8')
        except: continue
        print(f"{k}\t{s}".replace('\n','\\n'))
