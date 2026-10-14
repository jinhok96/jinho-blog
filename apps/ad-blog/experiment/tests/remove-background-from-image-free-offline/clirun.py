import subprocess, sys, time, resource
t=time.time(); p=subprocess.run(sys.argv[1:], capture_output=True, text=True); dt=time.time()-t
print('rc', p.returncode, 'sec', round(dt,1), 'peakGB', round(resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss/1e6,2)); print(p.stderr[-600:])
